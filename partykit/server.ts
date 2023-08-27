import { Party, PartyConnection } from "partykit/server";
import { YPartyKitOptions, onConnect } from "y-partykit";

// See https://github.com/partykit/partykit#y-partykit
// deploy: npx partykit deploy server.ts --name emobridge
export default {
  async onConnect(conn: PartyConnection, room: Party, opts?: YPartyKitOptions) {
    return await onConnect(conn, room, {
      persist: true,
    });
  },
};
