// --------------------------------------------------------------------------------------
// API Reference: https://www.amplenote.com/help/developing_amplenote_plugins
// Tips on developing plugins: https://www.amplenote.com/help/guide_to_developing_amplenote_plugins
const plugin = {
    // --------------------------------------------------------------------------------------
    constants: {
      COLORS: [
        "#FF0000", // Red
        "#0000FF", // Blue
        "#00FF00", // Green
      ],
      HEADER_LEVELS: [1, 2, 3, 4, 5, 6],
    },

    // --------------------------------------------------------------------------
    // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
    noteOption: {
      "Header Colors": {
        check: async function(app, noteUUID) {
          return await checkHeaders(app, noteUUID);
        },
        run: async function(app, noteUUID) {
          await toggleHeaderColors(app, noteUUID);
        }
      }
    },

    // --------------------------------------------------------------------------
    // https://www.amplenote_com/help/developing_amplenote_plugins#replaceText
    replaceText: {
      "Toggle Header Colors": {
        regex: /\b(h1|h2|h3|h4|h5|h6):\s+(.+?)\s*\n?/g,
        replace: async function(match, headerType, content) {
          const level = this.constants.HEADER_LEVELS.indexOf(parseInt(headerType.slice(1)));
          if (level !== -1) {
            return `${headerType} ${this.constants.COLORS[this.currentColorIndex % this.constants.COLORS.length]} ${content}`;
          }
          return match;
        },
      }
    },

    // Initialize the plugin
    initialize: async function() {
      this.currentColorIndex = 0;
    },

    // Toggle header colors
    toggleHeaderColors: async function(app, noteUUID) {
      await checkHeaders(app, noteUUID);
      await toggleColors(app, noteUUID);
    },

    // Check headers in a note
    checkHeaders: async function(app, noteUUID) {
      const noteContent = await app.getNoteContent(noteUUID);
      const headers = parseMarkdownHeaders(noteContent);

      headers.forEach((header) => {
        this.headerStates[header.level] = {
          text: header.text,
          colorIndex: -1
        };
      });
    },

    // Parse Markdown headers
    parseMarkdownHeaders: function(text) {
      const regex = /(?:^|\n)(#+)\s+(.+?)\s*(?:\n|$)/g;
      let match;
      const headers = [];

      while ((match = regex.exec(text)) !== null) {
        headers.push({
          level: parseInt(match[1].length),
          text: match[2]
        });
      }

      return headers;
    },

    // Replace header with colored version
    replaceHeader: function(level, text, colorIndex) {
      const pattern = new RegExp(`^(#{${level}})\\s+(${text})`, 'gm');
      const replacement = `#${colorIndex} ${text}`;
      return replacement;
    },

    // Toggle colors for all headers
    toggleColors: async function(app, noteUUID) {
      const noteContent = await app.getNoteContent(noteUUID);
      const updatedContent = noteContent.replace(
        /\b(h1|h2|h3|h4|h5|h6):\s+(.+?)\s*\n?/g,
        (match, headerType, content) => {
          const level = this.constants.HEADER_LEVELS.indexOf(parseInt(headerType.slice(1)));
          if (level !== -1 && this.headerStates[level]) {
            const currentState = this.headerStates[level];
            const newColorIndex = (currentState.colorIndex + 1) % this.constants.COLORS.length;

            if (newColorIndex !== currentState.colorIndex) {
              return `${headerType} ${this.constants.COLORS[newColorIndex]} ${content}`;
            }
          }
          return match;
        }
      );

      await app.updateNoteContent(noteUUID, updatedContent);
    }
  };

  export default plugin;
