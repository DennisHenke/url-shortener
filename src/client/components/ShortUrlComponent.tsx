import { IShortUrl } from "../../server/url-shortening/short-url";

function ShortUrlComponent(props: {
  shortUrlObject: IShortUrl;
  renderLongUrl: boolean;
  renderShortUrl: boolean;
}) {
  const fullShortUrl = new URL(window.location.href);
  fullShortUrl.hash = props.shortUrlObject.id;

  return (
    <>
      <p className="mb-2 mt-2 font-medium text-xl">
        {props.renderShortUrl && (
          <a href={fullShortUrl.toString()} target="_blank">
            {fullShortUrl.toString()}
          </a>
        )}
        {props.renderLongUrl && (
          <a href={props.shortUrlObject.longUrl}>
            {props.shortUrlObject.longUrl}
          </a>
        )}
      </p>
      <p className="text-sm">#Visited: {props.shortUrlObject.visitedCount}</p>
      <p className="text-sm">
        #Shortened: {props.shortUrlObject.shortenedCount}
      </p>
      <p className="text-sm">Created at {props.shortUrlObject.createdAt}</p>
    </>
  );
}

export default ShortUrlComponent;
