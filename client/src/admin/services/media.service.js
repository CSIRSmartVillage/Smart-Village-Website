import axios from "axios";

const API =
  import.meta.env.VITE_API_URL;

const API_URL =
  `${API}/admin/media`;

const SUPPORTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const getToken = () =>
  localStorage.getItem(
    "accessToken"
  );

const authConfig = () => ({
  headers: {
    Authorization:
      `Bearer ${getToken()}`,
  },
});

const captureVideoThumbnail =
  (file) => {
    return new Promise(
      (resolve, reject) => {
        const video =
          document.createElement(
            "video"
          );

        const objectUrl =
          URL.createObjectURL(file);

        let captured = false;

        const timeoutId =
          window.setTimeout(
            () => fail(),
            15000
          );

        const cleanUp = () => {
          window.clearTimeout(
            timeoutId
          );

          URL.revokeObjectURL(
            objectUrl
          );

          video.removeAttribute(
            "src"
          );

          video.load();
        };

        const fail = () => {
          if (captured) {
            return;
          }

          captured = true;
          cleanUp();

          reject(
            new Error(
              "This video format cannot be previewed. Please use a browser-compatible MP4, WebM or MOV file."
            )
          );
        };

        const capture = () => {
          if (captured) {
            return;
          }

          captured = true;

          if (
            !video.videoWidth ||
            !video.videoHeight
          ) {
            cleanUp();

            reject(
              new Error(
                "Failed to read the video frame."
              )
            );
            return;
          }

          const maxWidth = 1280;
          const scale = Math.min(
            1,
            maxWidth /
              video.videoWidth
          );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width = Math.max(
            1,
            Math.round(
              video.videoWidth * scale
            )
          );

          canvas.height = Math.max(
            1,
            Math.round(
              video.videoHeight * scale
            )
          );

          const context =
            canvas.getContext("2d");

          context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
          );

          canvas.toBlob(
            (blob) => {
              cleanUp();

              if (!blob) {
                reject(
                  new Error(
                    "Failed to generate the video thumbnail."
                  )
                );
                return;
              }

              const baseName =
                file.name.replace(
                  /\.[^.]+$/,
                  ""
                );

              resolve(
                new File(
                  [blob],
                  `${baseName}-thumbnail.jpg`,
                  {
                    type:
                      "image/jpeg",
                  }
                )
              );
            },
            "image/jpeg",
            0.85
          );
        };

        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.onerror = fail;

        video.onloadeddata = () => {
          if (
            Number.isFinite(
              video.duration
            ) &&
            video.duration > 0.1
          ) {
            video.currentTime = 0.1;
          } else {
            capture();
          }
        };

        video.onseeked = capture;
        video.src = objectUrl;
        video.load();
      }
    );
  };

export const getAllMedia =
  async (mediaType = "") => {
    const response =
      await axios.get(
        API_URL,
        {
          ...authConfig(),
          params:
            mediaType &&
            mediaType !== "all"
              ? {
                  type: mediaType,
                }
              : undefined,
        }
      );

    return response.data.data;
  };

export const uploadMedia =
  async (file) => {
    const maxFileSize =
      Number(
        import.meta.env
          .VITE_MAX_MEDIA_FILE_SIZE_MB ||
          250
      ) *
      1024 *
      1024;

    if (file.size > maxFileSize) {
      throw new Error(
        "The selected file exceeds the upload size limit."
      );
    }

    let thumbnail = null;

    if (
      file.type.startsWith(
        "video/"
      )
    ) {
      if (
        !SUPPORTED_VIDEO_TYPES.includes(
          file.type
        )
      ) {
        throw new Error(
          "Please upload an MP4, WebM or MOV video."
        );
      }

      thumbnail =
        await captureVideoThumbnail(
          file
        );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    if (thumbnail) {
      formData.append(
        "thumbnail",
        thumbnail
      );
    }

    const response =
      await axios.post(
        `${API_URL}/upload`,
        formData,
        authConfig()
      );

    return response.data.data;
  };

export const deleteMedia =
  async (id) => {
    const response =
      await axios.delete(
        `${API_URL}/${id}`,
        authConfig()
      );

    return response.data.data;
  };