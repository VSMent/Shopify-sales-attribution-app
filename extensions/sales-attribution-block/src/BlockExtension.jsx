import {
  AdminBlock,
  BlockStack,
  InlineStack,
  ProgressIndicator,
  reactExtension,
  Text,
  useApi,
} from '@shopify/ui-extensions-react/admin'
import { getSourceFields } from './utils'
import { useEffect, useState } from 'react'

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.order-details.block.render'

export default reactExtension(TARGET, () => <App />)

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const { i18n, data } = useApi(TARGET)
  const orderId = data.selected[0].id
  const [loading, setLoading] = useState(true)
  const [sourceFields, setSourceFields] = useState({ sourceName: '', sourceIdentifier: '' })

  // console.log({ data })

  useEffect(() => {
    (async () => {
      const sourceFields = await getSourceFields(orderId)
      if (sourceFields?.data?.order) {
        setSourceFields(sourceFields.data.order)
      }
      setLoading(false)
    })()
  }, [orderId])

  return loading ? (<InlineStack blockAlignment="center" inlineAlignment="center">
    <ProgressIndicator size="large-100" />
  </InlineStack>) : (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title={i18n.translate('name')}>
      <BlockStack blockGap='base'>
        {Object.entries(sourceFields).map(([key, value]) =>
          <InlineStack inlineAlignment="space-between">
            <Text fontWeight="bold">{i18n.translate(key)}</Text>
            <Text>{value}</Text>
          </InlineStack>
        )}
        {/*<Text fontWeight="bold">{i18n.translate('sourceName')}: {sourceFields.sourceName}</Text>*/}
        {/*<Text fontWeight="bold">{i18n.translate('sourceIdentifier')}: {sourceFields.sourceIdentifier}</Text>*/}
      </BlockStack>
    </AdminBlock>
  )
}