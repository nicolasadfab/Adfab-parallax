/**
 * Plugin parallax v1.1 (may 2012)
 * Author Adfab - connect
 * 
 * HOW TO USE :
 * ---------------------------
 * |    --------------       | ^
 * |    |    I am    |       | |
 * |    | a parallax |       | |
 * |    --------------       | 
 * |                         |
 * |      I contain a        |
 * |       parallax          |
 * ---------------------------
 * 
 * Set up 2 block a "CONTAINER" and A "CONTENT"
 * 
 * ON THE CONTAINER :
 * position : absolute (NOT A PARAM)
 * width : int (PARAM)
 * height : int (PARAM)
 * zIndex : int (PARAM)
 * 
 * ON THE CONTENT :
 * way : top | left (PARAM)
 * reverse : reserve the way to bottom | right 
 * step : float (0.1 to xx) More the number is high more the parallax will move fast
 * 
 * OTER :
 * debug : add background, border and high z-index to help
 * addToScrollTop : add top more pixel to scrollTop position
 * 
 *  {
 *      way: "top",
 *      reversed: false,
 *      addToScrollTop: 128,
 *      step: 2.2,
 *      width: 510,
 *      height: 1600,
 *      zIndex:2,
 *      debug: false
 *  }
 * 
 */

/**
 * @param way :: string (top | left)
 * @param reversed :: boolean
 * @param addToScrollTop :: int
 * @param step :: float (0.1 to x)
 * @param width :: int
 * @param height :: int
 * @param zIndex :: int
 * @param debug :: boolean
 */
(function($) {
    $.fn.paranoidllax = function(params) {
        // Get the params and put it on plugin params
        var context = $(this),
                scrollable = $(window),
                parent = context.parent(),
                scrolled = null,
                way = params.way,
                max = 0,
                min = 0,
                offsetMin = 0,
                offsetMax = 0,
                percent = 0,
                contextHeight = params.height,
                contextWidth = params.width,
                scrollPrev = 0,
                step = params.step,
                reversed = params.reversed,
                posFixe = params.posFixe,
                debug = (params.debug == true) ? true : false,
                margeTop = (params.margeTop == null) ? null : params.margeTop + 'px',
                top = (params.top == null) ? '0px'  : params.top + 'px';
        
        // Set the position to CONTAINER
        context.css({
            position: "absolute",
            height: contextHeight + "px",
            width: contextWidth + "px",
            marginTop : (margeTop != null) ? '-' + margeTop : context.css('margin-top'),
            top : top,
            zIndex: params.zIndex
        });
        
        // Get all CONTENT into CONTAINER and add it into a wrapper named "parallax-item"
        context.html("<div class='parallax-item'>" + context.html() + "</div>");
        scrolled = context.find(".parallax-item");
    
        min = 0;
        //contextHeight = parseInt(context.height() - scrolled.height())
        
        offsetMin = context.offset().top;
        offsetMax = parseInt(context.offset().top + contextHeight);
        
        if(debug) { 
            console.log(" offsetMin : " + offsetMin);
            console.log(" offsetMin (" + offsetMin + ") +  contextHeight (" + contextHeight + ") : " + parseInt(offsetMin + contextHeight));
            console.log(" offsetMax : " + offsetMax);
        }
        
        // Set the position to CONTENT
        if(way == "top") {
            scrolled.css({
                position: "absolute",
                top: min,
                marginTop : (margeTop != null) ? margeTop : context.css('margin-top')
            });
        }else {
            scrolled.css({
                position: "absolute",
                left: min,
                marginTop : (margeTop != null) ? margeTop : context.css('margin-top')
            });
        }
        
        // Call first the scroll parallax function if the page was loaded at not the top of window
        doScroll();
        
        // Event catch the scroll on page
        scrollable.on("scroll", function(e) {
            doScroll((scrollPrev > scrollable.scrollTop()) ? -1 : 1);
            scrollPrev = scrollable.scrollTop();
        });
        
        // Set up debug display if selected
        if(debug) {         
            context.css({
                borderTop: "5px solid #000000",
                borderBottom: "5px solid #000000"
            });
            context.prepend("<div class='fakeContext'></div><div style=' z-index: 999999999; font-weight: bold;'>Start 0%</div>");
            context.append("<div style='position: absolute; bottom: 0px; z-index: 999999999; font-weight: bold;'>Stop 100%</div>");
            context.find(".fakeContext").css({
                backgroundImage: "-moz-repeating-linear-gradient(" + ((way == 'top') ? '0deg' : '90deg') + ", transparent, transparent 5px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.5) 10px)",
                backgroundColor: "rgba(79, 145, 255, 0.5)",
                zIndex: 9999999,
                top: context.find(".parallax-item").css("margin-top"),
                left: context.find(".parallax-item").css("margin-left"),
                position: "absolute",
                width: context.width() + "px",
                height: parseInt(contextHeight + context.find(".parallax-item").height()) + "px"
            });
            context.find(".parallax-item").css({
                backgroundColor: "rgba(255, 3, 80, 0.5)",
                zIndex: 99999999
            });
            context.find(".parallax-item").append("<div class='percent' style='position: absolute; top: 5px; right: 5px; font-size: 16px; font-weight: bold;'>0%</div>");
        }
        
        // Calcul the position of parallax between min and max 
        function doScroll(scrollWay) {
            var h = (offsetMax - offsetMin),
                s = (scrollable.scrollTop() - offsetMin) * step,
                percent = s * 100 / h,
                newPos = 0,
                isScrolling = true;
                
            if(percent > 100) { percent = 100; isScrolling = false; }
            else if(percent < 0) { percent = 0; isScrolling = false; }
            
            newPos = (!reversed) ? percent * h / 100 : h - ((percent * h / 100));
            
            if(way == "top") {
                scrolled.css({"top": newPos});
            }else {
                scrolled.css({"left": newPos});
            }
            
            if(debug) {
                context.find(".parallax-item").find(".percent").html("Percent : " + Math.round(percent) + "% (" + Math.round(newPos) + "px / " + (offsetMax - offsetMin) + "px)");
                console.info(scrolled.css("top"));
                if(isScrolling) {
                    context.find(".fakeContext").css({
                        backgroundColor: "rgba(163, 255, 3, 0.5)"
                    });
                    context.find(".parallax-item").css({
                        backgroundColor: "rgba(107, 169, 0, 0.5)"
                    });
                }else {
                    context.find(".fakeContext").css({
                        backgroundColor: "rgba(79, 145, 255, 0.5)"
                    });
                    context.find(".parallax-item").css({
                        backgroundColor: "rgba(255, 3, 80, 0.5)"
                    });
                }
            }
        }
    };
})(jQuery);
