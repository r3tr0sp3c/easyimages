<?php
/**
 * @package Easy Images
 * @subpackage Content.easyimages
 * @version $Id: easyimages.php 599 2021-01-25 18:00:00
 * @author Filippos Kyparissopoulos
 * @copyright (C) 2021- Filippos Kyparissopoulos
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
**/

defined('_JEXEC') or die;
jimport('joomla.plugin.plugin');
JHtml::stylesheet(JUri::base() . 'plugins/content/easyimages/css/easyimages.css');

class plgContentEasyImages extends JPlugin 
{
    
    function onAfterRender()
    {
        $app = JFactory::getApplication();
        if ($app->isSite())
        {
            $pageBody = $app->getBody();
            $insert = "<script src=\"" . JUri::base() . "plugins/content/easyimages/js/easyimages.js\"></script>";
            $pageBody = str_ireplace('</body>',$insert.'</body>',$pageBody);
            $app->setBody($pageBody);
        }
    }
    function onContentPrepare ($context, &$article, &$params)
    {
        // Exit if the content is being indexed
        if ($context === 'com_finder.indexer')
		{
			return true;
        }
        
        if ( is_object($article) && $context === 'com_content.article' )
        {
            switch($this->params['typeofaction'])
            {
                case 0:
                    $this->modalImages($article);
                    break;
                case 1:
                    $this->groupImages($article);                    
            }
        }
    }

    private function modalImages($article)
    {
        // Callback function for preg_replace_callback
        function divImage($matches)
        {
            return '<div class="easy-images-item">' . $matches[0] . '</div>';
        }

        $patern = '/<img([\w\W]+?)\>/';
        $article->text = preg_replace_callback($patern, 'divImage', $article->text);
    }

    private function groupImages($article)
    {
        $patern = '/<img([\w\W]+?)\>/';
        $matches = array();
        $images = array();

        // Match and acquire image tag and image url
        $match = preg_match_all($patern, $article->text, $matches, PREG_SET_ORDER);
        $countMatches = count($matches);
        foreach ($matches as $key=>$value) {
            $images[$key] = $value[0];
        }
        //Match and remove images
            
        // $this refers to the plugin that is being called when article is being prepared
        $group = $this->params['group'] or 10;
        $article->text = preg_replace($patern, "", $article->text);

        // Calculate the number of galleries
        $countGalleries = ceil(($countMatches) / $group);

        // Construct modal structure based on user group entry
        $j = 0;
        $k = 0;
        for ($i=0; $i<$countGalleries; $i++) {
            $html_code = "<div class='easy-images'>";
            $html_code1 ="";
            for ($j=0; $j<$group; $j++) {
                if (($j+$k)<$countMatches) {
                    $html_code1 .= '<div class="ei-picture">';
                    $html_code1 .= $images[$j+$k];
                    $html_code1 .= "</div>";
                }
            }
            $k+=$group;
            $html_code .= $html_code1 . "</div>";
            $article->text .= $html_code;
        }
    }

}

