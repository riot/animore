import AnimateMount from './components/animate-mount.riot'
import { component } from 'riot'
import { expect } from 'chai'

describe('riot-animore core', () => {
  it('a simple tag can be properly animated on mount', (done) => {
    const div = document.createElement('div')
    const cmp = component(AnimateMount)(div, {
      onAnimationFinished: () => done()
    })

    expect(cmp).to.be.ok
  })
})
