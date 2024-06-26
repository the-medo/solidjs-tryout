import MainLayout from '../components/layouts/Main';
import { useParams } from '@solidjs/router';
import { createEffect, createResource, onMount, Show } from 'solid-js';
import { getGlideById } from '../api/glide';
import GlidePost from '../components/glides/GlidePost';
import { CenteredDataLoader } from '../components/utils/DataLoader';
import { FaSolidArrowLeft } from 'solid-icons/fa';
import Messenger from '../components/utils/Messenger';
import { User } from '../types/User';
import useSubglides from '../hooks/useSubglides';
import PaginatedGlides from '../components/glides/PaginatedGlides';
import { Glide } from '../types/Glide';

const GlideDetailScreen = () => {
  const params = useParams();

  const onGlideLoaded = (glide: Glide) => {
    resetPagination();
    loadGlides(glide.lookup!);
  };

  const [data, { mutate, refetch }] = createResource(async () => {
    const glide = await getGlideById(params.id, params.uid);
    onGlideLoaded(glide);
    return glide;
  });
  const { store, loadGlides, page, addGlide, resetPagination } = useSubglides();
  const user = () => data()?.user as User;

  createEffect(() => {
    if (!data.loading && data()?.id !== params.id) {
      refetch();
    }
  });

  const onGlideAdded = (newGlide?: Glide) => {
    const glide = data()!;

    mutate({
      ...glide,
      subglidesCount: glide.subglidesCount + 1,
    });

    addGlide(newGlide);
  };

  return (
    <MainLayout
      onGlideAdded={onGlideAdded}
      selectedGlide={data()}
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
          <Messenger answerTo={data()?.lookup} onGlideAdded={onGlideAdded} showAvatar={false} />
        </div>
        <PaginatedGlides
          page={page}
          pages={store.pages}
          loading={store.loading}
          loadGlides={() => {
            const lookup = data()?.lookup!;
            return loadGlides(lookup);
          }}
        />
      </Show>
    </MainLayout>
  );
};

export default GlideDetailScreen;
