import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

register('@riotjs/register', pathToFileURL('./'))

GlobalRegistrator.register()
