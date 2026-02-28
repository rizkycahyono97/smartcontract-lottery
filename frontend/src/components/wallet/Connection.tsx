import Image from 'next/image';
import { useConnection, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';

export function Connection() {
  const { address } = useConnection();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && (
        <Image alt="ENS Avatar" src={ensAvatar} width={40} height={40} />
      )}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <Button className="mt-5" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}
