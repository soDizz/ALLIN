import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const fetchDocument = async (url: string) => {
  const response = await fetch(url);
  const content = await response.text();
  return content;
};

export const crawl = async (url: string) => {
  let documentString = await fetchDocument(url);

  // remove <script> tags and <style> tags and <footer> tags and <header> tags and <nav> tags
  documentString = documentString.replace(
    /<script[^>]*>[\s\S]*?<\/script>|<style[^>]*>[\s\S]*?<\/style>|<footer[^>]*>[\s\S]*?<\/footer>|<header[^>]*>[\s\S]*?<\/header>|<nav[^>]*>[\s\S]*?<\/nav>/gi,
    '',
  );
  const dom = new JSDOM(documentString);
  const document = dom.window.document;

  const body = document.querySelector('body');
  const main = document.querySelector('main');

  let htmlContent: string;

  if (main) {
    htmlContent = main.innerHTML ?? '';
  } else if (body) {
    htmlContent = body.innerHTML ?? '';
  } else {
    htmlContent = '';
  }

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(htmlContent);

  return markdown;
};
