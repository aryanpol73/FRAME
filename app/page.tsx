export default function Placeholder() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40 }}>
      <h1>Nothing rewrote this request</h1>
      <p>
        Every page of this site is a file under <code>public/</code>, served by a rewrite in
        <code> next.config.mjs</code>. Seeing this page means the rewrite for this route is
        missing - add it there.
      </p>
    </main>
  )
}
