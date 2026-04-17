// api/geolocation.js
import { geolocation } from '@vercel/functions';

// use Vercel edge network since our function is lightweight
export const config = {
    runtime: 'edge',
};

export default {
    fetch(request: Request) {
        const { city, country } = geolocation(request);

        if (city && country) {
            return new Response(JSON.stringify({ city, country }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else {
            return new Response(JSON.stringify({ city: 'the Internet', country: 'Earth' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
}