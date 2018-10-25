import { parseModule } from 'esprima';

export interface ImportModuleInfo {
  importedName: string;
  moduleName: string;
}

export interface TemplateImports {
  [localName: string]: ImportModuleInfo;
};

const FRONT_MATTER_CONTENT_REGEX = /---([\s\S]*?)---\s?/;

export function stripTemplateImports(source: string): string {
  return source.replace(FRONT_MATTER_CONTENT_REGEX, '');
}

export function getTemplateImports(source: string): TemplateImports {
  const importsMatch = FRONT_MATTER_CONTENT_REGEX.exec(source);
  if (!importsMatch || !importsMatch[1]) {
    return {};
  }

  const importsStr = importsMatch[1].trim();
  const program = parseModule(importsStr);
  const templateImports: TemplateImports = {};

  for (let declaration of program.body) {
    if (declaration.type !== 'ImportDeclaration') {
      throw new Error('Only imports are supported in template front matter');
    }

    const source = declaration.source.value;

    if (typeof source !== 'string') {
      throw new Error('Only string literals are supported as module names');
    }

    for (let specifier of declaration.specifiers) {
      if (specifier.type !== 'ImportSpecifier') {
        throw new Error('Only named imports are supported. Default and star imports are disallowed');
      }

      templateImports[specifier.local.name] = {
        importedName: specifier.imported.name,
        moduleName: source
      };
    }
  }

  return templateImports;
}
