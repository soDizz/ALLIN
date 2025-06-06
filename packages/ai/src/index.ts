// sdk-specific imports
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient, WeatherClient } from '@agentic/stdlib';
import { SlackMCPServer } from '@mcp-server/slack';
import dotenv from 'dotenv';

dotenv.config();

// const slack = new SlackClient();
// const weather = new WeatherClient();

async function main() {
  if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_TEAM_ID) {
    throw new Error('SLACK_BOT_TOKEN and SLACK_TEAM_ID must be set');
  }

  const slack = new SlackMCPServer({
    botToken: process.env.SLACK_BOT_TOKEN,
    slackTeamId: process.env.SLACK_TEAM_ID,
  });

  const res = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    tools: {
      listChannels: slack.listChannelsTool,
      postMessage: slack.postMessageTool,
    },
    prompt: '슬랙의 인터렉션_좋아요 채널에 안녕하세요 라고 메세지 보내줘.',
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
  console.log('finished');
}

main();
