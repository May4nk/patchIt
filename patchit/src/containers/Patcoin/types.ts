export type walletmodetype = "home" | "send" | "add";

export type walletstatetype = "history" | "stats" | "earn";

export type charttype = "bar" | "line" | "pie" | "bubble";

export type addpatctointype = { amnt: number };

export interface sendpatcointype extends addpatctointype {
  address: string;
}

export type handlewalletmodetype = (mode: walletmodetype) => void;

export interface actionpropstype {
  activeState: walletstatetype;
  handleWalletMode: handlewalletmodetype;
  setActiveState: React.Dispatch<React.SetStateAction<walletstatetype>>;
}

export interface patcoinhomepropstype {
  activeState: walletstatetype;
  handleWalletMode: handlewalletmodetype;
  setActiveState: React.Dispatch<React.SetStateAction<walletstatetype>>;
}

export interface patcoinsendpropstype {
  handleWalletMode: handlewalletmodetype;
}

export interface patcoinaddpropstype {
  handleWalletMode: handlewalletmodetype;
}
