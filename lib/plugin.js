import { proofImportIsPossible } from "./arbitrary-plugin-module"

// --------------------------------------------------------------------------------------
// API Reference: https://www.amplenote.com/help/developing_amplenote_plugins
// Tips on developing plugins: https://www.amplenote.com/help/guide_to_developing_amplenote_plugins
const plugin = {
  // --------------------------------------------------------------------------------------
  constants: {
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#insertText
  insertText: {
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
  noteOption: {
    "Header Colors": {
      check: async function(app, noteUUID) {
        const noteContent = await app.getNoteContent({ uuid: noteUUID });

        // This note option is ONLY shown when the note contains markdown headers (#, ##, ###)
        return /^#{1,3}\s/m.test(noteContent);
      },
      run: async function(app, noteUUID) {
        const markdown = await app.getNoteContent({ uuid: noteUUID });
        async function toggleHeaderColors(app, noteUUID) {
          // Get the note content
          const noteContent = await app.getNoteContent({ uuid: noteUUID });

          // Function to process the markdown content and toggle header colors
          function processMarkdown(markdown) {
              // Split markdown by lines for easy line-by-line processing
              let lines = markdown.split('\n');

              // Loop through each line to find headers and modify them accordingly
              lines = lines.map(line => {
                  // Regular expression to match headers (e.g., #, ##, ###) with optional color comments
                  let headerPattern = /^(#+)\s+(.+?)\s*(==.*?<!--\s*{"cycleColor":\s*"\d+"}\s*==)?$/;

                  // Match the line with the header pattern
                  let match = line.match(headerPattern);

                  if (match) {
                      // Extract the header symbols (#, ##, ###), content, and color status
                      let header = match[1];  // the #, ##, ### part
                      let headerContent = match[2]; // the content after the header
                      let hasColor = match[3]; // whether the color comment exists

                      // Conditionally add or remove the color comment
                      if (hasColor) {
                          // Remove the color comment if it exists
                          return `${header} ${headerContent}`;
                      } else {
                          // Add the color comment if it doesn't exist
                          return `${header} ==${headerContent}<!-- {"cycleColor": "23"} -->==`;
                      }
                  }

                  // Return the line unchanged if it's not a header
                  return line;
              });

              // Join the modified lines back into a single markdown string
              return lines.join('\n');
          }

          // Process the markdown content to toggle header colors
          let modifiedMarkdown = processMarkdown(noteContent);

          // Replace the note's content with the modified markdown
          await app.replaceNoteContent({ uuid: noteUUID }, modifiedMarkdown);
          console.log("Success!");
      }
        // await app.alert("You clicked the Baby's first Note Option command in a COOL note!");
        // console.debug("Special message to the DevTools console");
      }
    }
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#replaceText
  replaceText: {
  },

  // There are several other entry points available, check them out here: https://www.amplenote.com/help/developing_amplenote_plugins#Actions
  // You can delete any of the insertText/noteOptions/replaceText keys if you don't need them
};
export default plugin;
