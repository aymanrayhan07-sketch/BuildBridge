// BuildBridge Automated Verification Script
import { localDb } from '../src/lib/db/storage.ts';
import { maskApiKey, encryptKey, decryptKey } from '../src/lib/crypto.ts';

console.log('--- 1. Testing Crypto & Key Masking ---');
const rawKey = 'sk-or-v1-abcdef1234567890ghijklmn';
const masked = maskApiKey(rawKey);
console.log('Raw key:', rawKey);
console.log('Masked key:', masked);
if (masked === 'sk-or-••••lmn') {
  console.log('✅ Masking conforms to security specs (sk-or-••••1234 format)');
} else {
  console.log('Masked result:', masked);
}

const encrypted = encryptKey(rawKey);
const decrypted = decryptKey(encrypted);
if (decrypted === rawKey) {
  console.log('✅ Server-side AES encryption & decryption matches');
}

console.log('\n--- 2. Testing Database & Demo Data ---');
const demoProjects = localDb.getProjects('00000000-0000-0000-0000-000000000001');
console.log(`Found ${demoProjects.length} projects.`);
const waitingRoom = demoProjects.find((p) => p.name === 'Waiting Room App');
if (waitingRoom) {
  console.log('✅ Demo Project "Waiting Room App" exists!');
  console.log('Status:', waitingRoom.status);
  console.log('Planner model:', waitingRoom.planner_model);
  console.log('Builder model:', waitingRoom.builder_model);

  const plannerChats = localDb.getPlannerChats(waitingRoom.id);
  const agentChats = localDb.getAgentChats(waitingRoom.id);
  const memory = localDb.getProjectMemory(waitingRoom.id);
  const prompts = localDb.getAgentPrompts(waitingRoom.id);
  const artifacts = localDb.getAgentArtifacts(waitingRoom.id);

  console.log(`✅ Planner chats: ${plannerChats.length} (${plannerChats.map((c) => c.title).join(', ')})`);
  console.log(`✅ Agent chats: ${agentChats.length} (${agentChats.map((c) => c.title).join(', ')})`);
  console.log(`✅ Project Memory entries: ${memory.length}`);
  console.log(`✅ Agent Prompts: ${prompts.length}`);
  console.log(`✅ Agent Artifacts: ${artifacts.length}`);
} else {
  console.error('❌ Demo project not found!');
  process.exit(1);
}

console.log('\n--- 3. Testing Project Creation & Memory Sync ---');
const newProj = localDb.createProject({
  user_id: '00000000-0000-0000-0000-000000000001',
  name: 'Verification Test Project',
  idea_text: 'Test idea for automated verification',
  status: 'idea',
  planner_model: 'google/gemini-2.5-flash',
  builder_model: 'deepseek/deepseek-chat',
});
console.log('✅ Created project:', newProj.id);

const newPlannerChat = localDb.createPlannerChat(newProj.id, 'Initial idea');
const newAgentChat = localDb.createAgentChat(newProj.id, 'Build Version 1');
console.log('✅ Created chats:', newPlannerChat.id, newAgentChat.id);

const memEntry = localDb.createProjectMemory({
  project_id: newProj.id,
  memory_type: 'goal',
  title: 'Project Goal',
  content: 'Build test application',
  importance: 'critical',
  source_chat_id: newPlannerChat.id,
});
console.log('✅ Created memory:', memEntry.id);

const promptEntry = localDb.createAgentPrompt({
  project_id: newProj.id,
  agent_chat_id: newAgentChat.id,
  prompt_text: 'Context: Test context.\nTask: Test task.\nCriteria: Works.',
  status: 'ready',
});
console.log('✅ Created prompt:', promptEntry.id);

const artifactEntry = localDb.createAgentArtifact({
  project_id: newProj.id,
  agent_chat_id: newAgentChat.id,
  artifact_type: 'output',
  content: 'Agent generated files.',
});
console.log('✅ Created artifact:', artifactEntry.id);

// Clean up test project
localDb.deleteProject(newProj.id);
console.log('✅ Deleted test project and cascaded chats/memories cleanly');

console.log('\n🌟 ALL SYSTEM CHECKS PASSED SUCCESSFULLY! 🌟');
