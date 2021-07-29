export function generateCopiedTemplateName(templates, baseTemplateId) {
  const currentTemplate = templates.find(item => item.id === baseTemplateId);
  const { name: baseTemplateName } = currentTemplate;
  const copiedTemplatesCount = templates.filter(item =>
    item.name.includes(`${baseTemplateName} - Copy`)
  ).length;

  const newTemplateName =
    copiedTemplatesCount === 0
      ? `${baseTemplateName} - Copy`
      : `${baseTemplateName} - Copy (${copiedTemplatesCount})`;

  return newTemplateName;
}

const NEW_TEMPLATE_NAME = 'New Template';
export function generateNewTemplateName(templates) {
  const newTemplatesCount = templates.filter(item => item.name.includes(NEW_TEMPLATE_NAME)).length;
  const newTemplateName =
    newTemplatesCount === 0 ? NEW_TEMPLATE_NAME : `${NEW_TEMPLATE_NAME} (${newTemplatesCount})`;

  return newTemplateName;
}
