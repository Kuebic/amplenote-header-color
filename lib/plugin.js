// --------------------------------------------------------------------------------------
// API Reference: https://www.amplenote.com/help/developing_amplenote_plugins
// Tips on developing plugins: https://www.amplenote.com/help/guide_to_developing_amplenote_plugins
const plugin = {
    // --------------------------------------------------------------------------------------
    constants: {
      HEADER_COLORS: ["#FF5733", "#33FF57", "#3357FF"], // Example predetermined colors
      HEADER_REGEX: /^(#+)( .+)$/gm // Regex to match Markdown headers
    },

    // --------------------------------------------------------------------------
    // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
    noteOption: {
      "Toggle Header Colors": {
        check: async function(app, noteUUID) {
          const noteContent = await app.getNoteContent({ uuid: noteUUID });
          // This note option is shown for any note that contains headers
          return plugin.constants.HEADER_REGEX.test(noteContent);
        },
        run: async function(app, noteUUID) {
          const noteContent = await app.getNoteContent({ uuid: noteUUID });
          const newContent = noteContent.replace(plugin.constants.HEADER_REGEX, (match, p1, p2) => {
            const colorIndex = plugin.constants.HEADER_COLORS.findIndex(color => match.includes(color));
            const nextColor = plugin.constants.HEADER_COLORS[(colorIndex + 1) % plugin.constants.HEADER_COLORS.length];
            return `${p1} <span style="color:${nextColor}">${p2}</span>`;
          });

          await app.replaceNoteContent({ uuid: noteUUID, content: newContent });
          console.debug("Toggled header colors in the note");
        }
      }
    },

    // There are several other entry points available, check them out here: https://www.amplenote.com/help/developing_amplenote_plugins#Actions
    // You can delete any of the insertText/noteOptions/replaceText keys if you don't need them
  };
  export default plugin;
