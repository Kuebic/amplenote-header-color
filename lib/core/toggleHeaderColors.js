import { colorScheme } from './colors';

export async function toggleHeaderColors(app, noteUUID) {
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

        // Get the appropriate color for the header level
        let color = colorScheme[header];

        // Conditionally add or remove the color comment
        if (hasColor) {
          // Remove the color comment if it exists
          return `${header} ${headerContent}`;
        } else {
          // Add the color comment if it doesn't exist
          return `${header} ==${headerContent}<!-- {"cycleColor": "${color}"} -->==`;
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
