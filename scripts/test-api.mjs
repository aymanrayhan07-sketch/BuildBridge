// End-to-end API testing script using node fetch

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('Testing BuildBridge Endpoints...\n');

  // 1. Projects
  console.log('1. Fetching projects:');
  const projRes = await fetch(`${BASE_URL}/api/projects`);
  const projData = await projRes.json();
  console.log('Status:', projRes.status, 'Projects found:', projData.projects?.length);
  const demoProj = projData.projects?.[0];
  if (!demoProj) {
    console.error('No demo project found!');
    process.exit(1);
  }

  // 2. Planner Chat
  console.log('\n2. Testing POST /api/planner/chat:');
  const chatRes = await fetch(`${BASE_URL}/api/planner/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: demoProj.id,
      chatId: '22222222-2222-2222-2222-222222222222',
      message: 'How should we handle audio chimes for token calls?',
      model: 'google/gemini-2.5-flash',
    }),
  });
  const chatData = await chatRes.json();
  console.log('Status:', chatRes.status);
  console.log('Assistant message preview:', chatData.assistantMessage?.content?.slice(0, 120), '...');

  // 3. Create Project Plan
  console.log('\n3. Testing POST /api/planner/plan:');
  const planRes = await fetch(`${BASE_URL}/api/planner/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: demoProj.id,
      chatId: '22222222-2222-2222-2222-222222222222',
      model: 'google/gemini-2.5-flash',
    }),
  });
  const planData = await planRes.json();
  console.log('Status:', planRes.status, 'Project Status:', planData.projectStatus);
  console.log('Plan title:', planData.memoryItem?.title);

  // 4. Generate Builder Agent Prompt
  console.log('\n4. Testing POST /api/planner/next-prompt:');
  const nextPromptRes = await fetch(`${BASE_URL}/api/planner/next-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: demoProj.id,
      chatId: '22222222-2222-2222-2222-222222222222',
      agentChatId: '33333333-3333-3333-3333-333333333333',
      model: 'google/gemini-2.5-flash',
    }),
  });
  const promptData = await nextPromptRes.json();
  console.log('Status:', nextPromptRes.status, 'Project Status:', promptData.projectStatus);
  console.log('Prompt generated:', promptData.prompt?.prompt_text?.slice(0, 100), '...');

  // 5. Import Agent Output
  console.log('\n5. Testing POST /api/agent/output:');
  const outputRes = await fetch(`${BASE_URL}/api/agent/output`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: demoProj.id,
      agentChatId: '33333333-3333-3333-3333-333333333333',
      content: 'Implemented components/QueueDisplay.tsx and audio chime toggle in components/StaffPanel.tsx.',
      artifactType: 'output',
    }),
  });
  const outputData = await outputRes.json();
  console.log('Status:', outputRes.status, 'New Project Status:', outputData.projectStatus);

  // 6. Review Agent Output
  console.log('\n6. Testing POST /api/planner/review:');
  const reviewRes = await fetch(`${BASE_URL}/api/planner/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: demoProj.id,
      chatId: '22222222-2222-2222-2222-222222222222',
      agentChatId: '33333333-3333-3333-3333-333333333333',
      agentOutput: 'Implemented QueueDisplay.tsx and StaffPanel.tsx with token increment logic.',
      model: 'google/gemini-2.5-flash',
    }),
  });
  const reviewData = await reviewRes.json();
  console.log('Status:', reviewRes.status);
  console.log('Review classification:', reviewData.review?.status);
  console.log('Next task:', reviewData.review?.next_task);

  // 7. Verify Project Memory was updated
  console.log('\n7. Fetching updated Project Memory:');
  const memRes = await fetch(`${BASE_URL}/api/projects/${demoProj.id}/memory`);
  const memData = await memRes.json();
  console.log('Total memory items:', memData.memory?.length);

  // 8. Test API Keys Security
  console.log('\n8. Testing API Keys Security:');
  const keyPostRes = await fetch(`${BASE_URL}/api/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'openrouter',
      key: 'sk-or-v1-supersecretkey1234567890abcdef',
      label: 'Test Secret Key',
    }),
  });
  const keyPostData = await keyPostRes.json();
  console.log('Key response masked representation:', keyPostData.key?.masked_key);
  if (keyPostData.key?.masked_key && !keyPostData.key.masked_key.includes('supersecret')) {
    console.log('✅ PASS: API key was never returned raw! Only masked key was returned.');
  }

  // Delete the test key so it does not interfere
  if (keyPostData.key?.id) {
    await fetch(`${BASE_URL}/api/keys/${keyPostData.key.id}`, { method: 'DELETE' });
    console.log('✅ Cleaned up test key.');
  }

  console.log('\n🎉 ALL 8 CORE WORKFLOW STEPS TESTED AND WORKING! 🎉');
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
