import './globals.css';
import './identity.css';
import { WalletProvider } from '../components/wallet-provider';
export const metadata={title:'RepliGraph — semantic replication graph',description:'A public provenance graph for scientific experiment relations.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><WalletProvider>{children}</WalletProvider></body></html>}
