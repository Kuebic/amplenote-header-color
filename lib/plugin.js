const plugin = {
    name: "Header Color Toggle",
    description: "Toggle header colors in your notes",
    version: "1.0",
    author: "Your Name",

    initialize: async function() {
      this.headerStates = {};
      this.currentColorIndex = 0;
      this.colors = ["red", "blue", "green"];

      this.addCommand({
        name: "Toggle Header Colors",
        callback: () => this.toggleColors()
      });

      this.addHotKey("ctrl+shift+h", () => this.toggleColors());
    },

    toggleColors: function() {
      const headers = this.parseMarkdown(document.body.innerHTML);

      headers.forEach(header => {
        const [level, text] = header;

        if (!this.headerStates[level]) {
          this.headerStates[level] = { text, colorIndex: -1 };
        }

        const currentState = this.headerStates[level];
        const newColorIndex = (currentState.colorIndex + 1) % this.colors.length;

        if (newColorIndex !== currentState.colorIndex) {
          this.replaceHeader(level, text, newColorIndex);
          this.headerStates[level].colorIndex = newColorIndex;
        }
      });
    },

    parseMarkdown: function(text) {
      const regex = /(?:^|\n)(#+)\s+(.+?)\s*(?:\n|$)/g;
      let match;
      const headers = [];

      while ((match = regex.exec(text)) !== null) {
        headers.push([parseInt(match[1].length), match[2]]);
      }

      return headers;
    },

    replaceHeader: function(level, text, colorIndex) {
      const pattern = new RegExp(`^(#{${level}})\\s+(${text})`, 'gm');
      const replacement = `#${this.colors[colorIndex]} ${text}`;
      document.body.innerHTML = document.body.innerHTML.replace(pattern, replacement);
    }
  };
