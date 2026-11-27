/**
 * Preenche `{nome}` num texto do dicionário: format("Olá, {name}", { name: "Ana" }).
 * Chave sem valor fica como está, para o erro aparecer na tela e não sumir.
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
