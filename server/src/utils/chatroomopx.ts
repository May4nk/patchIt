export function revRoomCode(roomCode: string): {
  code: string;
  isRoom: boolean;
} {
  const roomCodePayload: string[] = roomCode.split("-");
  const code = roomCodePayload[1];
  const users: number[] = JSON.parse(atob(code));
  const revCode = `room-${btoa(JSON.stringify(users.reverse()))}`;
  return { code: revCode, isRoom: roomCodePayload.length > 2 };
}
