/** ใส่ JSON-LD แบบปลอดภัย (escape < กันปิด script tag กลางคัน) */
export default function JsonLd({
  id,
  data,
}: {
  id: string;
  data: unknown;
}) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
