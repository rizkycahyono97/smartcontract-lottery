import { LotteryEntranceStatus } from '@/src/components/lottery/LotteryEntraceStatus';
import { EnterLottery } from '@/src/components/lottery/EnterLottery';

export default function lotteryPage() {
  return (
    <div className="mt-5">
      <LotteryEntranceStatus />
      <EnterLottery />
    </div>
  );
}
