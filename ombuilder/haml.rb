require 'ombuilder/extensions/haml/context'

class Haml::Context
  def getPageId(page)
    return '#' << page.to_s
  end

  def getPageParams(page)
    if not (Set[:main, :list].include? page)
      {
        :data => {
          :add_back_btn => "true"
        }
      }
    else
      {}
    end
  end

  def getPageTemplateName(page)
    return '_page_' << page.to_s << '.haml'
  end

  def getNavCssClass(current_page, button)
    pages = { :main => :main,
      :select => :main,
      :form => :main,
      :list => :list,
      :view => :list
    }

    if pages[current_page] == button
      { :class => ['ui-btn-active', 'ui-state-persist'] }
    else
      {}
    end
  end
end
