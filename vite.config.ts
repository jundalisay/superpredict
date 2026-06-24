// import { sveltekit } from '@sveltejs/vite-plugin-svelte';
// import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
// 	plugins: [tailwindcss(), sveltekit()]
// });


// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//     plugins: [tailwindcss(), sveltekit()]
// });



import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(async () => {
    const { sveltekit } = await import('@sveltejs/kit/vite');
    
    return {
        plugins: [tailwindcss(), sveltekit()]
    };
});