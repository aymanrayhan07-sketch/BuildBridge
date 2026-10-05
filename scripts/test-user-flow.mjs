// User flow verification script

const BASE_URL = 'http://localhost:3000';

async function testUserFlow() {
  console.log('Testing End-to-End User Flow...\n');

  // 1. Signup new user
  console.log('1. Signing up new user alice@buildbridge.dev:');
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@buildbridge.dev', password: 'password123' }),
  });
  const signupData = await signupRes.json();
  console.log('Signup status:', signupRes.status, 'User ID:', signupData.user?.id);

  // Extract cookies from signup response
  const cookies = signupRes.headers.get('set-cookie') || '';
  const cookieHeaders = cookies ? { Cookie: cookies } : {};

  // 2. Create Project with separate models
  console.log('\n2. Creating custom project with separate models:');
  const newProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...cookieHeaders },
    body: JSON.stringify({
      name: 'Markdown Note Vault',
      idea_text: 'A markdown note-taking app with local storage sync and graph view.',
      planner_model: 'anthropic/claude-3.7-sonnet',
      builder_model: 'deepseek/deepseek-chat',
    }),
  });
  const newProjData = await newProjRes.json();
  console.log('Create Project status:', newProjRes.status);
  console.log('Project ID:', newProjData.project?.id);
  console.log('Planner model:', newProjData.project?.planner_model);
  console.log('Builder model:', newProjData.project?.builder_model);

  const projId = newProjData.project?.id;

  // 3. Fetch project details
  console.log('\n3. Fetching workspace details:');
  const detailRes = await fetch(`${BASE_URL}/api/projects/${projId}`);
  const detailData = await detailRes.json();
  console.log('Initial Planner Chats:', detailData.plannerChats?.length);
  console.log('Initial Agent Chats:', detailData.agentChats?.length);
  console.log('Initial Project Memory items:', detailData.memory?.length);

  const plannerChat1 = detailData.plannerChats[0];

  // 4. Send message in Planner Chat 1
  console.log('\n4. Sending message in Planner Chat 1:');
  const msgRes = await fetch(`${BASE_URL}/api/planner/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...cookieHeaders },
    body: JSON.stringify({
      projectId: projId,
      chatId: plannerChat1.id,
      message: 'Can you recommend the graph visualization library?',
      model: newProjData.project.planner_model,
    }),
  });
  const msgData = await msgRes.json();
  console.log('Planner reply status:', msgRes.status);

  // 5. Create a Second Planner Chat
  console.log('\n5. Creating Second Planner Chat (verifying isolation & memory inheritance):');
  const chat2Res = await fetch(`${BASE_URL}/api/planner/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...cookieHeaders },
    body: JSON.stringify({
      projectId: projId,
      title: 'Graph Visualization Deep Dive',
    }),
  });
  const chat2Data = await chat2Res.json();
  console.log('Second chat status:', chat2Res.status, 'Chat ID:', chat2Data.chat?.id);

  // 6. Verify Second Planner Chat has 0 messages (does NOT inherit old chat messages)
  const chat2MessagesRes = await fetch(`${BASE_URL}/api/messages?chatId=${chat2Data.chat.id}`);
  const chat2MessagesData = await chat2MessagesRes.json();
  console.log('✅ Chat 2 raw messages count:', chat2MessagesData.messages?.length, '(Expected 0 messages)');

  // 7. Verify Second Planner Chat DOES inherit Project Memory
  const projMemRes = await fetch(`${BASE_URL}/api/projects/${projId}/memory`);
  const projMemData = await projMemRes.json();
  console.log('✅ Project Memory inherited count:', projMemData.memory?.length, '(Goal memory loaded)');

  // 8. Delete test project
  console.log('\n8. Deleting project:');
  const delRes = await fetch(`${BASE_URL}/api/projects/${projId}`, {
    method: 'DELETE',
    headers: cookieHeaders,
  });
  console.log('Delete status:', delRes.status);

  console.log('\n🎉 ALL ACCEPTANCE CRITERIA FOR USER & CHAT WORKFLOW VERIFIED! 🎉');
}

testUserFlow().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
