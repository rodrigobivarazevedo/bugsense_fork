import numpy as np
from skimage.color import rgb2lab

def is_significantly_different(prev_image, image, threshold, mode = "sliding_window", roi_size=10, use_stride_size=5):

        image = image.permute(1, 2, 0).numpy()
        image = rgb2lab(image)
       
        if mode == "sliding_window":
            stride = use_stride_size
            h, w = image.shape[:2]
            for i in range(0, h-roi_size+1, stride):
                for j in range(0, w-roi_size+1, stride):
                    roi_current = image[i:i+roi_size, j:j+roi_size]
                    roi_prev = prev_image[i:i+roi_size, j:j+roi_size]
                    delta_E = np.sqrt(np.sum((roi_current - roi_prev) ** 2, axis=2))
                    roi_mean_delta_E = np.mean(delta_E)
                    if roi_mean_delta_E > threshold:
                        return True
                    
        elif mode == "random":
            for i in range(0, 50):
                i = np.random.randint(0, image.shape[0]- roi_size)
                j = np.random.randint(0, image.shape[1] - roi_size)
                roi_current = image[i:i+roi_size, j:j+roi_size]
                roi_prev = prev_image[i:i+roi_size, j:j+roi_size]
                delta_E = np.sqrt(np.sum((roi_current - roi_prev) ** 2, axis=2))
                roi_mean_delta_E = np.mean(delta_E)
                if roi_mean_delta_E < threshold:
                    return True
                
        return False
                    

def find_stopping_point(image_tensor, threshold, mode = "sliding_window", use_roi_size=10, use_stride_size=5, use_prev_image=None):
    for index in range(len(image_tensor)):
        image = image_tensor[index]
        image = image.permute(1, 2, 0).numpy()
        image = rgb2lab(image)
        if index == 0:
            prev_image = image
            continue
        
        roi_size = use_roi_size

        if mode == "sliding_window":
            stride = use_stride_size
            h, w = image.shape[:2]
            for i in range(0, h-roi_size+1, stride):
                for j in range(0, w-roi_size+1, stride):
                    roi_current = image[i:i+roi_size, j:j+roi_size]
                    roi_prev = prev_image[i:i+roi_size, j:j+roi_size]
                    delta_E = np.sqrt(np.sum((roi_current - roi_prev) ** 2, axis=2))
                    roi_mean_delta_E = np.mean(delta_E)
                    if roi_mean_delta_E > threshold:
                        return index
                    
                # if None we are always comparing to the first image to find the stopping point
                if use_prev_image:
                    prev_image = image
      
    return index