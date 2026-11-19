const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type ServiceData = {
    name: string;
    category: string;
    description: string;
    price: string;
    duration: string;
    image: string;
    status: string;
}

export const createService = async (formData: FormData) => {
    try {
        const imageFile = formData.get("image") as File;
        let imageUrl = "";
        
        if (imageFile && imageFile.size > 0) {
            const imgBbFormData = new FormData();
            imgBbFormData.append("image", imageFile);
            
            const imgBbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
            
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

      
        const serviceData: ServiceData = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            price: formData.get("price") as string,
            duration: formData.get("duration") as string,
            status: formData.get("status") as string,
            image: imageUrl, 
        };

        
        const res = await fetch(`${BASE_URL}/services`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        })
        
        if (!res.ok) {
            throw new Error("Failed to create service")
        }

        return await res.json();
    } catch (error) {
        console.error("Error in createService:", error)
        return null; 
    }
}