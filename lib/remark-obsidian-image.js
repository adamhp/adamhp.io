const { visit } = require('unist-util-visit');

module.exports = function remarkObsidianImage() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      const { value } = node;
      if (!value || !value.includes('![[')) return;

      // Replace Obsidian image syntax with MDX component
      node.value = value.replace(
        /!\[\[([^|\]]+?)(\|([^|\]]+?))?\]\]/g,
        (match, imagePath, altSyntax, altText) => {
          // Extract just the filename for alt text if no alt provided
          const filename = imagePath.split('/').pop();
          const alt = altText || filename?.replace(/\.[^/.]+$/, '') || 'Image';

          return `<ObsidianImage src="${imagePath}" alt="${alt}" />`;
        },
      );
    });
  };
};
