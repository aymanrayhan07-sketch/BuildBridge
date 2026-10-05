import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  idea_text: z.string().optional(),
  planner_model: z.string().default('google/gemini-2.5-flash'),
  builder_model: z.string().default('deepseek/deepseek-chat'),
  reference_url: z.string().url().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    const projects = await db.getProjects(user.id);
    return NextResponse.json({ projects });
  } catch (err) {
    logger.error('Failed fetching projects', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { name, idea_text, planner_model, builder_model } = parsed.data;

    const project = await db.createProject({
      user_id: user.id,
      name,
      idea_text,
      status: 'idea',
      planner_model,
      builder_model,
    });

    // Automatically create initial Planner Chat and Agent Chat
    const plannerChat = await db.createPlannerChat(project.id, 'Initial idea');
    await db.createAgentChat(project.id, 'Build Version 1');

    // Add initial project memory if idea text was provided
    if (idea_text) {
      await db.createProjectMemory({
        project_id: project.id,
        memory_type: 'goal',
        title: 'Project Goal',
        content: idea_text,
        source_chat_id: plannerChat.id,
        importance: 'critical',
      });

      // Also create initial welcome message from Planner
      await db.createMessage({
        chat_id: plannerChat.id,
        chat_type: 'planner',
        role: 'assistant',
        content: `Welcome to **${project.name}**! I've loaded your project goal into Project Memory:\n\n> "${idea_text}"\n\nHow would you like to start? We can refine the architecture, discuss the technical stack, or click **"Create Project Plan"** to outline the build phases!`,
        model_used: planner_model,
        tokens_in: 25,
        tokens_out: 65,
      });
    }

    logger.info('Project created successfully', { projectId: project.id, name: project.name });
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    logger.error('Failed creating project', { error: String(err) });
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
