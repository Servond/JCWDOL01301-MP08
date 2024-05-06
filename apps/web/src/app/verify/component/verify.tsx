'use client';
import instance from '@/utils/instances';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Verify() {
  const params = useSearchParams();
  const router = useRouter();

  const verify = async () => {
    try {
      const param = params.toString().replace('token=', '');
      await instance.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${param}`,
        },
      });
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Hey, welcome to TICKERING</h1>
      <p>
        Before proceed to buy or sell ticket, you need to verify your account!
      </p>
      <p>click the button below to verify your account</p>
      <button title="verify" onClick={() => verify()}>
        Verify
      </button>
    </>
  );
}
