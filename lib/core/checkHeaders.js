export async function checkHeaders(app, noteUUID) {
    const noteContent = await app.getNoteContent({ uuid: noteUUID });

    // This note option is ONLY shown when the note contains markdown headers (#, ##, ###)
    return /^#{1,3}\s/m.test(noteContent);
  }
