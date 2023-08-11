import { useState, useEffect } from "react";
import { IShortUrl } from "../server/url-shortening/short-url";
import ShortUrlComponent from "./components/ShortUrlComponent";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [shortUrlObject, setShortUrlObject] = useState<IShortUrl>();

  const urlHash = window.location.hash;

  const shortenUrl = async () => {
    const fetchCreateShortUrlResponse = await fetch(`/api/v1/shortened-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longUrl: longUrl,
      }),
    });
    if (
      fetchCreateShortUrlResponse.status === 200 ||
      fetchCreateShortUrlResponse.status === 201
    ) {
      const shortUrl = (await fetchCreateShortUrlResponse.json()) as IShortUrl;
      setShortUrlObject(shortUrl);
      setError("");
    } else {
      const error = await fetchCreateShortUrlResponse.json();
      setError(error.error);
    }
  };

  useEffect(() => {
    (async () => {
      if (!!urlHash) {
        const fetchShortUrlResponse = await fetch(
          `/api/v1/shortened-url/${urlHash.substring(1)}`
        );
        if (fetchShortUrlResponse.status === 200) {
          const shortUrl = (await fetchShortUrlResponse.json()) as IShortUrl;
          setShortUrlObject(shortUrl);

          setTimeout(() => {
            window.location.href = shortUrl.longUrl;
          }, 5000);
        } else {
          const error = await fetchShortUrlResponse.json();
          setError(error.error);
        }
      }
    })();
  }, [urlHash]);

  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-silver py-6 sm:py-12">
        <div className="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 bg-beige w-full">
          <h1 className="text-3xl text-black">ShortMyURL</h1>
          <div className="border-b border-gold border-dashed mb-2 mt-2"></div>
          <div>
            {urlHash ? (
              <div>
                {shortUrlObject ? (
                  <>
                    <p>You will be redirectly shortly to:</p>
                    <ShortUrlComponent
                      shortUrlObject={shortUrlObject}
                      renderLongUrl={true}
                      renderShortUrl={false}
                    />
                  </>
                ) : (
                  <p className="text-red-700 font-medium">{error}</p>
                )}
              </div>
            ) : (
              <div className="px-2 pt-6 pb-8">
                <div className="mb-4">
                  <label className="block text-red-darker text-sm font-bold mb-2">
                    My URL
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="longUrl"
                    onChange={(e) => setLongUrl(e.target.value)}
                  />
                </div>
                <button
                  className="bg-red-default hover:bg-red-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={shortenUrl}
                >
                  Shorten it!
                </button>
                {error && <p className="text-red-700 font-medium">{error}</p>}
                {shortUrlObject && (
                  <>
                    <div className="border-b border-gold border-dashed mb-2 mt-2"></div>
                    <p>Your short URL:</p>
                    <ShortUrlComponent
                      shortUrlObject={shortUrlObject}
                      renderLongUrl={false}
                      renderShortUrl={true}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
