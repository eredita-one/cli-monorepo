import type it from "./dictionaries/it.json";

/**
 * Formato dos dicionários. O italiano é a fonte de verdade: toda chave
 * adicionada em `it.json` precisa existir nos demais idiomas, senão o build falha.
 */
export type Dictionary = typeof it;
