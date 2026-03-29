package com.pastefox.settings

import com.intellij.openapi.options.Configurable
import javax.swing.*

class PasteFoxConfigurable : Configurable {

    private var panel: JPanel? = null
    private var apiKeyField: JPasswordField? = null
    private var instanceUrlField: JTextField? = null
    private var visibilityCombo: JComboBox<String>? = null
    private var expirationCombo: JComboBox<String>? = null
    private var openInBrowserCheck: JCheckBox? = null
    private var copyToClipboardCheck: JCheckBox? = null
    private var skipPromptsCheck: JCheckBox? = null

    override fun getDisplayName(): String = "PasteFox"

    override fun createComponent(): JComponent {
        val p = JPanel().apply { layout = BoxLayout(this, BoxLayout.Y_AXIS) }
        val settings = PasteFoxSettings.getInstance().state

        fun row(label: String, comp: JComponent): JPanel {
            return JPanel().apply {
                layout = BoxLayout(this, BoxLayout.X_AXIS)
                add(JLabel(label).apply { preferredSize = java.awt.Dimension(140, 25) })
                add(comp)
                alignmentX = JPanel.LEFT_ALIGNMENT
                maximumSize = java.awt.Dimension(Int.MAX_VALUE, 35)
            }
        }

        apiKeyField = JPasswordField(settings.apiKey, 30)
        instanceUrlField = JTextField(settings.instanceUrl, 30)
        visibilityCombo = JComboBox(arrayOf("PUBLIC", "UNLISTED", "PRIVATE")).apply { selectedItem = settings.defaultVisibility }
        expirationCombo = JComboBox(arrayOf("never", "10m", "1h", "1d", "7d", "30d")).apply { selectedItem = settings.defaultExpiration }
        openInBrowserCheck = JCheckBox("Open paste in browser after creation", settings.openInBrowser)
        copyToClipboardCheck = JCheckBox("Copy URL to clipboard", settings.copyToClipboard)
        skipPromptsCheck = JCheckBox("Skip visibility/title prompts (use defaults)", settings.skipPrompts)

        p.add(row("API Key:", apiKeyField!!))
        p.add(Box.createVerticalStrut(4))
        p.add(row("Instance URL:", instanceUrlField!!))
        p.add(Box.createVerticalStrut(4))
        p.add(row("Default Visibility:", visibilityCombo!!))
        p.add(Box.createVerticalStrut(4))
        p.add(row("Default Expiration:", expirationCombo!!))
        p.add(Box.createVerticalStrut(8))
        p.add(openInBrowserCheck!!.apply { alignmentX = JPanel.LEFT_ALIGNMENT })
        p.add(copyToClipboardCheck!!.apply { alignmentX = JPanel.LEFT_ALIGNMENT })
        p.add(skipPromptsCheck!!.apply { alignmentX = JPanel.LEFT_ALIGNMENT })
        p.add(Box.createVerticalStrut(12))
        p.add(JLabel("<html><small>Get your API key at <b>pastefox.com/dashboard/api-keys</b></small></html>").apply { alignmentX = JPanel.LEFT_ALIGNMENT })

        panel = p
        return p
    }

    override fun isModified(): Boolean {
        val s = PasteFoxSettings.getInstance().state
        return String(apiKeyField!!.password) != s.apiKey
                || instanceUrlField!!.text != s.instanceUrl
                || visibilityCombo!!.selectedItem != s.defaultVisibility
                || expirationCombo!!.selectedItem != s.defaultExpiration
                || openInBrowserCheck!!.isSelected != s.openInBrowser
                || copyToClipboardCheck!!.isSelected != s.copyToClipboard
                || skipPromptsCheck!!.isSelected != s.skipPrompts
    }

    override fun apply() {
        val s = PasteFoxSettings.getInstance().state
        s.apiKey = String(apiKeyField!!.password)
        s.instanceUrl = instanceUrlField!!.text.trimEnd('/')
        s.defaultVisibility = visibilityCombo!!.selectedItem as String
        s.defaultExpiration = expirationCombo!!.selectedItem as String
        s.openInBrowser = openInBrowserCheck!!.isSelected
        s.copyToClipboard = copyToClipboardCheck!!.isSelected
        s.skipPrompts = skipPromptsCheck!!.isSelected
    }

    override fun reset() {
        val s = PasteFoxSettings.getInstance().state
        apiKeyField!!.text = s.apiKey
        instanceUrlField!!.text = s.instanceUrl
        visibilityCombo!!.selectedItem = s.defaultVisibility
        expirationCombo!!.selectedItem = s.defaultExpiration
        openInBrowserCheck!!.isSelected = s.openInBrowser
        copyToClipboardCheck!!.isSelected = s.copyToClipboard
        skipPromptsCheck!!.isSelected = s.skipPrompts
    }
}
