import { authFetch } from "../core/client"

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000"

export type ServiceData = {
    serviceName: string; 
    category: string;
    description: string;
    price: number;    // ⬅️ string থেকে number করা হলো
    duration: number; // ⬅️ string থেকে number করা হলো
    image: string;
    status: string;
}

export const createService = async (formData: FormData) => {
    try {
        const imageFile = formData.get("image") as File;
        let imageUrl = "";

        // ১. ইমেজ আপলোড (ImgBB)
        if (imageFile && imageFile.size > 0) {
            const imgBbFormData = new FormData();
            imgBbFormData.append("image", imageFile);
            const imgBbApiKey = process.env.IMGBB_API_KEY;

            const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbApiKey}`, {
                method: "POST",
                body: imgBbFormData,
            });
            const imgData = await imgRes.json();
            if (imgData.success) {
                imageUrl = imgData.data.url;
            } else {
                throw new Error("Image upload failed");
            }
        }

        // ২. সার্ভিস ডেটা তৈরি
        const serviceData: ServiceData = {
            serviceName: formData.get("serviceName") as string, 
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),       // ⬅️ Number এ কনভার্ট
            duration: Number(formData.get("duration")), // ⬅️ Number এ কনভার্ট
            status: formData.get("status") as string,
            image: imageUrl,
        };

        // ৩. ব্যাকএন্ডে পাঠানো (authFetch দিয়ে)
        const res = await authFetch(`${BASE_URL}/services`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(serviceData),
        })

        if (!res.ok) throw new Error("Failed to create service")
        return await res.json();
    } catch (error) {
        console.error("Error in createService:", error)
        return null;
    }
}

// Works with FormData (edit form) OR a plain object ({ status: "Inactive" })
export const updateService = async (id: string, data: FormData | Record<string, unknown>) => {
    try {
        let serviceData: Record<string, unknown> = {}

        if (data instanceof FormData) {
            const imageFile = data.get("image") as File;
            let imageUrl = "";

            if (imageFile && imageFile.size > 0) {
                const imgBbFormData = new FormData();
                imgBbFormData.append("image", imageFile);
                const imgBbApiKey = process.env.IMGBB_API_KEY;

                const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbApiKey}`, {
                    method: "POST",
                    body: imgBbFormData,
                });
                const imgData = await imgRes.json();
                if (imgData.success) imageUrl = imgData.data.url;
            }

            serviceData = {
                serviceName: data.get("serviceName"), 
                category: data.get("category"),
                description: data.get("description"),
                price: Number(data.get("price")),
                duration: Number(data.get("duration")),
                status: data.get("status"),
            }
            if (imageUrl) serviceData.image = imageUrl;
        } else {
            // Plain object, e.g. { status: "Inactive" }
            serviceData = data;
        }

        const res = await authFetch(`${BASE_URL}/services/${id}`, { 
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json"
            },
            body: JSON.stringify(serviceData),
        })

        if (!res.ok) throw new Error("Failed to update service")
        return await res.json();
    } catch (error) {
        console.error("Error in updateService:", error)
        return null;
    }
}

export const deleteService = async (id: string) => {
    const res = await authFetch(`${BASE_URL}/services/${id}`, { 
        method: "DELETE",
    })

    if (!res.ok) {
        console.error("Delete failed with status:", res.status)
        return null
    }

    return res.json()
}