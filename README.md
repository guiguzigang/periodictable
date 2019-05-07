# periodictable
three periodictable 元素周期表

```js
const gridBtn = document.querySelector('#grid');
const tableBtn = document.querySelector('#table');
const helixBtn = document.querySelector('#helix');
const planeBtn = document.querySelector('#plane');
const sphereBtn = document.querySelector('#sphere');
const sphere2Btn = document.querySelector('#sphere2');
const btns = document.querySelectorAll('button')
const container = document.querySelector('#container')

const periodictable = new Periodictable({
  container,
  positions,
  elements
})

function setActiveBtn(el) {
  btns.forEach(btn => {
    btn.className = 'btn'
  })
  el.className = 'btn active'
}

tableBtn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('table')
}, false)
planeBtn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('plane')
}, false)
gridBtn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('grid')
}, false)
helixBtn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('helix')
}, false)
sphereBtn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('sphere')
}, false)
sphere2Btn.addEventListener('click', function () {
  setActiveBtn(this)
  periodictable.changeLayout('sphere2')
}, false)
```
