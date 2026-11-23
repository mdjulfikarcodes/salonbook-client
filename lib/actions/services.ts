import { authFetch } from "../core/client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export type ServiceData = {
    serviceName: string; 
    category: string;
    description: string;
    price: number;  
    duration: number;
    image: string;
    status: string;
}


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const createService = async (formData: FormData) => {
    try {
        const imageFile = formData.get("image") as File;
        let imageUrl = "";

        // Image upload to ImgBB
        if (imageFile && imageFile.size > 0) {
            const base64Image = await fileToBase64(imageFile);
            
            const imgBbFormData = new URLSearchParams();
            imgBbFormData.append("image", base64Image);

            
            const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: imgBbFormData,
            });
            
            const imgData = await imgRes.json();
            
            if (imgData.success) {
                imageUrl = imgData.data.url;
            } else {
                console.error("ImgBB Error:", imgData);
                throw new Error("Image upload failed");
            }
        }

        const serviceData: ServiceData = {
            serviceName: formData.get("serviceName") as string, 
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),       
            duration: Number(formData.get("duration")), 
            status: (formData.get("status") as string) || "Active",
            image: imageUrl,
        };

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

export const updateService = async (id: string, data: FormData | Record<string, unknown>) => {
    try {
        let serviceData: Record<string, unknown> = {}

        if (data instanceof FormData) {
         
        } else {
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

    if (!res.ok) return null;
    return res.json();
}