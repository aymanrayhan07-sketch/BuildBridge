import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

const UpdateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  idea_text: z.string().optional(),
  status: z
    .enum(['idea', 'planned', 'prompt ready', 'building', 'needs review', 'needs fix', 'completed'])
    .optional(),
  planner_model: z.string().optional(),
  builder_model: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await db.getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const plannerChats = await db.getPlannerChats(id);
    const agentChats = await db.getAgentChats(id);
    const memory = await db.getProjectMemory(id);
    const prompts = await db.getAgentPrompts(id);
    const artifacts = await db.getAgentArtifacts(id);

    return NextResponse.json({
      project,
      plannerChats,
      agentChats,
      memory,
      prompts,
      artifacts,
    });
  } catch (err) {
    logger.error('Failed fetching project details', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
    }

    const updated = await db.updateProject(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project: updated });
  } catch (err) {
    logger.error('Failed updating project', { error: String(err) });
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await db.deleteProject(id);
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('Failed deleting project', { error: String(err) });
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
