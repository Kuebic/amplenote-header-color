{
    async noteOption(app, noteUUID) {

      // Fetch the markdown content of the note using its UUID
      const markdown = await app.getNoteContent({ uuid: noteUUID });

      const shouldColor = true;

      // Function to process the markdown content and add/remove color comments
      function processMarkdown(markdown, shouldColor) {
        // Split markdown by lines for easy line-by-line processing
        let lines = markdown.split('\n');

        // Loop through each line to find headers and modify them accordingly
        lines = lines.map(line => {
          // Regular expression to match headers (e.g., #, ##, ###)
          let headerPattern = /^(#+)\s+(==)?([^<\n]+?)(<!-- \{"cycleColor":"\d+"\} -->)?(==)?$/;

          // Match the line with the header pattern
          let match = line.match(headerPattern);

          if (match) {
            // Extract the header symbols (#, ##, ###), content, and color information
            let header = match[1]; // the #, ##, ### part
            let headerContent = match[3]; // the content after the header
            let colorComment = match[4]; // the color comment

            // Define color values for each header level
            const colorMap = {
              1: "23",  // Red
              2: "37",  // Green
              3: "29",  // Blue
              4: "31",  // Yellow
              5: "33",  // Purple
              6: "35"   // Cyan
            };

            // Determine the appropriate color based on the header level
            let headerLevel = header.length;
            let color = colorMap[headerLevel] || "30"; // Default color if header level is not in the map

            // Conditionally add or remove the color comment
            if (shouldColor && !colorComment) {
              // Add the color comment if it doesn't exist
              return `${header} ==${headerContent}<!-- {"cycleColor":"${color}"} -->==`;
            } else if (!shouldColor && colorComment) {
              // Remove the highlight markers and color comment if it exists
              return `${header} ${headerContent.trim()}`;
            }
          }

          // Return the line unchanged if it's not a header
          return line;
        });

        // Join the modified lines back into a single markdown string
        return lines.join('\n');
      }

      // Process the markdown content based on user input (collapse or expand headers)
      let modifiedMarkdown = processMarkdown(markdown, shouldColor);

      // Replace the note's content with the modified markdown
      await app.replaceNoteContent({ uuid: noteUUID }, modifiedMarkdown);
    }
  }
