function compileContent(fields) {
  return `---
date: "${fields.date || new Date().toISOString()}"
title: "${fields.title || fields.name || ""}"
tags: ${tagifyCategories(fields["category[]"])}
slug: "${fields.slug || generateSlug(fields)}"
${fields.title ? 'kind:"post"' : 'kind: "update"'}
${renderOptionalFields({ ...fields })}
---
${trimContent(fields.content || fields.body)}`;
}

function generateSlug(fields) {
  if (fields.name) {
    const words = fields.name.split(/\s+/);
    return words.length > 5 ? words.slice(0, 6).join("-") : words.join("-");
  }
  return generateDTSlug(fields.date);
}

function generateDTSlug(date) {
  if (date) {
    return `${Math.floor(new Date(date).getTime() / 1000) % (24 * 60 * 60)}`;
  }
  return `${Math.floor(new Date().getTime() / 1000) % (24 * 60 * 60)}`;
}

function tagifyCategories(categories) {
  if (!categories) {
    return "[]";
  }
  return `[${categories}]`;
}

function renderOptionalFields(fields) {
  const knownFields = [
    "date",
    "access_token",
    "category[]",
    "name",
    "slug",
    "h",
    "title",
    "content",
  ];
  knownFields.forEach((field) => {
    delete fields[field];
  });
  return Object.entries(fields)
    .map(([key, value]) => `${key}: "${value || ""}"`)
    .join("\n");
}

function trimContent(content) {
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content.map(trimContent);
  }
  if (typeof content === "object") {
    const newContent = {};
    Object.entries(content).forEach(([key, entry]) => {
      newContent[key] = trimContent(entry);
    });
    return newContent;
  }
  return "";
}

module.exports = { compileContent, generateSlug };
