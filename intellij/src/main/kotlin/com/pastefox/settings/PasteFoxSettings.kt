package com.pastefox.settings

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.*

@State(name = "PasteFoxSettings", storages = [Storage("PasteFoxSettings.xml")])
@Service(Service.Level.APP)
class PasteFoxSettings : PersistentStateComponent<PasteFoxSettings.State> {

    data class State(
        var apiKey: String = "",
        var instanceUrl: String = "https://pastefox.com",
        var defaultVisibility: String = "UNLISTED",
        var defaultExpiration: String = "never",
        var openInBrowser: Boolean = true,
        var copyToClipboard: Boolean = true,
        var skipPrompts: Boolean = false,
    )

    private var state = State()

    override fun getState(): State = state
    override fun loadState(state: State) { this.state = state }

    companion object {
        fun getInstance(): PasteFoxSettings =
            ApplicationManager.getApplication().getService(PasteFoxSettings::class.java)
    }
}
