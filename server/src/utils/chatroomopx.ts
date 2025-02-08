export function revRoomCode(roomName: string): {
  code: string;
  isRoom: boolean;
} {
  const roomCodePayload: string[] = roomName.split("-");
  const revCode = roomCodePayload.reverse().join("-");

  return { code: revCode, isRoom: roomCodePayload.length > 2 };
}
