// sdk-specific imports
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient } from '@mcp-server/slack';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_TEAM_ID) {
    throw new Error('SLACK_BOT_TOKEN and SLACK_TEAM_ID must be set');
  }

  const slack = new SlackClient({
    token: process.env.SLACK_BOT_TOKEN,
    slackTeamId: process.env.SLACK_TEAM_ID,
  });

  const res = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    tools: {
      ...createAISDKTools(slack),
    },
    prompt: '슬랙의 채널 목록 50개만 알려줘 ',
    maxSteps: 2,
    maxTokens: 3000,
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      console.log(text);
      console.log(toolCalls);
      toolResults.map(r => {
        console.log(r);
      });
      console.log(finishReason);
      console.log(usage);
    },
  });
  console.log(res);
}

// main();
