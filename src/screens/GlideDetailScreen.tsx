import MainLayout from '../components/layouts/Main';
import { useParams } from '@solidjs/router';
import { createResource, onMount, Show } from 'solid-js';
import { getGlideById } from '../api/glide';
import GlidePost from '../components/glides/GlidePost';
import { CenteredDataLoader } from '../components/utils/DataLoader';
import { FaSolidArrowLeft } from 'solid-icons/fa';
import Messenger from '../components/utils/Messenger';
import { User } from '../types/User';
import useSubglides from '../hooks/useSubglides';

const GlideDetailScreen = () => {
  const params = useParams();
  const [data] = createResource(() => getGlideById(params.id, params.uid));
  const { store, loadGlides } = useSubglides();

  const user = () => data()?.user as User;

  onMount(() => {
    loadGlides();
  });

  return (
    <MainLayout
      pageTitle={
        <div onClick={() => history.back()}>
          <div class="flex-it flex-row items-center text-xl cursor-pointer">
            <FaSolidArrowLeft />
            <div class="ml-5 font-bold">Back</div>
          </div>
        </div>
      }
    >
      <Show when={!data.loading} fallback={<CenteredDataLoader />}>
        <GlidePost glide={data()!} />
        <div class="p-2 border-b-1 border-solid border-gray-700">
          <div class="text-sm italic text-gray-300 underline mb-2 ml-4">
            Answering to {user().nickName}
          </div>
          <Messenger onGlideAdded={() => {}} showAvatar={false} />
        </div>
      </Show>
    </MainLayout>
  );
};

export default GlideDetailScreen;
