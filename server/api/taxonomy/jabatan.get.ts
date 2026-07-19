// server/api/taxonomy/jabatan.get.ts

interface DrupalTaxonomyResponse {
  data: {
    attributes: {
      name: string;
      drupal_internal__tid: number;
    };
  }[];
}

interface JabatanOption {
  label: string;
  value: number;
}

export default defineEventHandler(async (): Promise<JabatanOption[]> => {

  const config = useRuntimeConfig();

  const response = await $fetch<DrupalTaxonomyResponse>(
    `${config.public.drupalBaseUrl}/jsonapi/taxonomy_term/jabatan`,
    {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  );

  return response.data.map((item) => ({
    label: item.attributes.name,
    value: item.attributes.drupal_internal__tid,
  }));

});