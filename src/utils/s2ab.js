export function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)

  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i);// 'A' => 65
  }
  return view;
}
