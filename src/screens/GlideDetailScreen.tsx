import MainLayout from '../components/layouts/Main';
import { useParams } from '@solidjs/router';
import { onMount } from 'solid-js';
import { getGlideById } from '../api/glide';

const GlideDetailScreen = () => {
  const params = useParams();

  onMount(async () => {
    const glide = await getGlideById(params.id, params.uid);
    console.log(glide);
  });

  return (
    <MainLayout pageTitle="Detail">
      Hello glide detail!
      <div>id: {params.id}</div>
      <div>uid: {params.uid}</div>
    </MainLayout>
  );
};

export default GlideDetailScreen;
